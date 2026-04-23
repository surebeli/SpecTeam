#!/usr/bin/env bash
# SpecTeam Workflow E2E Test Runner v1.0
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
PASS=0; FAIL=0; SKIP=0; ERRORS=()

log_pass() { echo -e "  ${GREEN}✅ PASS${NC}: $1"; PASS=$((PASS+1)); }
log_fail() { echo -e "  ${RED}❌ FAIL${NC}: $1"; FAIL=$((FAIL+1)); ERRORS+=("$1"); }
log_skip() { echo -e "  ${YELLOW}⏭️  SKIP${NC}: $1"; SKIP=$((SKIP+1)); }
log_section() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

assert_file_exists() { [ -f "$1" ] && log_pass "Exists: $1" || log_fail "Missing: $1"; }
assert_dir_exists() { [ -d "$1" ] && log_pass "Dir: $1" || log_fail "No dir: $1"; }
assert_file_contains() {
  [ ! -f "$1" ] && { log_fail "Missing (content): $1"; return; }
  grep -q "$2" "$1" 2>/dev/null && log_pass "'$1' contains '$2'" || log_fail "'$1' missing '$2'"
}
assert_git_config_set() {
  local v; v=$(git config "$1" 2>/dev/null || echo "")
  [ -n "$v" ] && log_pass "git config $1 = $v" || log_fail "git config $1 is empty"
}
assert_commit_pattern() {
  git log --oneline -5 --format="%s" | grep -q "$1" && log_pass "Commit: $1" || log_fail "No commit: $1"
}

test_init_founder() {
  log_section "Test 01: Init — Founder"
  assert_dir_exists ".spec"
  assert_dir_exists ".spec/design"
  assert_file_exists ".spec/COLLABORATORS.md"
  assert_file_exists ".spec/THESIS.md"
  assert_file_exists ".spec/RULES.md"
  assert_file_exists ".spec/SIGNALS.md"
  assert_file_exists ".spec/INDEX.md"
  assert_git_config_set "spec.member-code"
  assert_git_config_set "spec.main-branch"
  assert_commit_pattern "\[SpecTeam\]"
  assert_file_contains ".spec/COLLABORATORS.md" "Main Branch"
}

test_init_join() {
  log_section "Test 02: Init — Join"
  local n; n=$(find .spec/design -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
  [ "$n" -ge 2 ] && log_pass "Collaborators: $n" || log_skip "Only $n collaborator(s)"
}

test_update_new() {
  log_section "Test 03: Update — New File"
  local mc; mc=$(git config spec.member-code 2>/dev/null || echo "")
  [ -z "$mc" ] && { log_skip "No identity"; return; }
  local d=".spec/design/$mc"
  [ -d "$d" ] && { local c; c=$(find "$d" -name "*.md" | wc -l); [ "$c" -gt 0 ] && log_pass "$c file(s) in $d" || log_fail "Empty: $d"; } || log_fail "Missing: $d"
  assert_file_exists ".spec/last-sync.json"
}

test_review_conflict() {
  log_section "Test 05: Review — Conflict"
  [ ! -f ".spec/DIVERGENCES.md" ] && { log_skip "No DIVERGENCES.md"; return; }
  assert_file_contains ".spec/DIVERGENCES.md" "D-001"
  assert_file_exists ".spec/last-review.json"
}

test_align_propose() {
  log_section "Test 06: Align — Propose"
  [ ! -f ".spec/DIVERGENCES.md" ] && { log_skip "No DIVERGENCES.md"; return; }
  grep -q "proposed" ".spec/DIVERGENCES.md" 2>/dev/null && { log_pass "Proposed found"; assert_file_contains ".spec/DIVERGENCES.md" "Proposer"; } || log_skip "No proposed divergences"
}

test_align_approve() {
  log_section "Test 07: Align — Approve Proposal"
  [ ! -f ".spec/DIVERGENCES.md" ] && { log_skip "No DIVERGENCES.md"; return; }
  if grep -q "proposed" ".spec/DIVERGENCES.md" 2>/dev/null; then
    log_pass "Proposed divergence found"
    assert_file_contains ".spec/DIVERGENCES.md" "Votes"
    assert_file_contains ".spec/DIVERGENCES.md" "approve"
    [ ! -d ".spec/decisions" ] && log_pass "No decision files before Lead finalization" || log_fail "Decision files exist before Lead finalization"
  else
    log_skip "No proposed divergences"
  fi
}

test_align_finalize() {
  log_section "Test 11: Align — Lead Finalize"
  [ ! -f ".spec/DIVERGENCES.md" ] && { log_skip "No DIVERGENCES.md"; return; }
  if grep -q "resolved" ".spec/DIVERGENCES.md" 2>/dev/null; then
    log_pass "Resolved divergence found"; assert_dir_exists ".spec/decisions"
    local dc; dc=$(find .spec/decisions -name "D-*.md" 2>/dev/null | wc -l)
    [ "$dc" -gt 0 ] && log_pass "Decision files: $dc" || log_fail "No decision files"
    assert_file_contains ".spec/THESIS.md" "Decision Log"
  else
    log_skip "No resolved divergences"
  fi
}

test_status() {
  log_section "Test 10: Status — Dashboard inputs"
  assert_file_exists ".spec/COLLABORATORS.md"
  assert_file_exists ".spec/INDEX.md"
}

test_push_drift() {
  log_section "Test 09: Push — Drift"
  [ ! -f ".spec/last-sync.json" ] && { log_skip "No last-sync.json"; return; }
  python3 -c "import json; json.load(open('.spec/last-sync.json'))" 2>/dev/null && log_pass "Valid JSON" || log_fail "Invalid JSON"
}

test_divergence_fixtures() {
  log_section "Test 12: Divergence Fixture Structure"
  node tests/validate-divergences.js tests/fixtures/divergences-proposed.md proposed >/dev/null 2>&1 \
    && log_pass "Proposed divergence fixture validated" \
    || log_fail "Proposed divergence fixture invalid"
  node tests/validate-divergences.js tests/fixtures/divergences-resolved.md resolved >/dev/null 2>&1 \
    && log_pass "Resolved divergence fixture validated" \
    || log_fail "Resolved divergence fixture invalid"
}

test_transcript_fixtures() {
  log_section "Test 13: Transcript Marker Fixtures"
  node tests/validate-divergences.js transcript 01-init-founder tests/transcripts/fixtures/01-init-founder.txt >/dev/null 2>&1 \
    && log_pass "Init founder transcript fixture validated" \
    || log_fail "Init founder transcript fixture invalid"
  node tests/validate-divergences.js transcript 05-review-conflict tests/transcripts/fixtures/05-review-conflict.txt >/dev/null 2>&1 \
    && log_pass "Review conflict transcript fixture validated" \
    || log_fail "Review conflict transcript fixture invalid"
  node tests/validate-divergences.js transcript 06-align-propose tests/transcripts/fixtures/06-align-propose.txt >/dev/null 2>&1 \
    && log_pass "Align propose transcript fixture validated" \
    || log_fail "Align propose transcript fixture invalid"
  node tests/validate-divergences.js transcript 07-align-approve tests/transcripts/fixtures/07-align-approve.txt >/dev/null 2>&1 \
    && log_pass "Align approve transcript fixture validated" \
    || log_fail "Align approve transcript fixture invalid"
  node tests/validate-divergences.js transcript 11-align-finalize tests/transcripts/fixtures/11-align-finalize.txt >/dev/null 2>&1 \
    && log_pass "Align finalize transcript fixture validated" \
    || log_fail "Align finalize transcript fixture invalid"
}

setup_mock() {
  log_section "Setup mock workspace"
  local SD; SD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; local RR; RR="$(cd "$SD/.." && pwd)"
  local WD; WD=$(mktemp -d); echo -e "  Workspace: ${BLUE}$WD${NC}"; cd "$WD"
  git init -b main; git commit --allow-empty -m "init"
  mkdir -p design-alice design-bob
  cp "$RR/tests/mock-scenarios/demo-1-conflict/alice/"*.md design-alice/
  cp "$RR/tests/mock-scenarios/demo-1-conflict/bob/"*.md design-bob/
  git add . && git commit -m "add mock docs"
  echo -e "\n  ${YELLOW}Next: cd $WD && run /spec-init${NC}"
}

print_summary() {
  log_section "Summary"
  echo -e "  ${GREEN}PASS${NC}: $PASS  ${RED}FAIL${NC}: $FAIL  ${YELLOW}SKIP${NC}: $SKIP  Total: $((PASS+FAIL+SKIP))"
  [ $FAIL -gt 0 ] && { echo -e "  ${RED}Failures:${NC}"; for e in "${ERRORS[@]}"; do echo "    - $e"; done; exit 1; }
  echo -e "  ${GREEN}All passed! 🎉${NC}"
}

main() {
  echo -e "${BLUE}SpecTeam Workflow E2E Test Runner v1.0${NC}\n"
  case "${1:---assert-only}" in
    --setup) setup_mock; exit 0 ;;
    --assert-only) [ ! -d ".spec" ] && { echo -e "${RED}No .spec/ — use --setup first${NC}"; exit 1; } ;;
    --test) [ -z "${2:-}" ] && { echo "Usage: $0 --test <name>"; exit 1; } ;;
    *) echo "Usage: $0 [--setup|--assert-only|--test <name>]"; exit 1 ;;
  esac

  if [ "${1:-}" = "--test" ]; then
    case "$2" in
      init-founder) test_init_founder ;; init-join) test_init_join ;;
      update-new) test_update_new ;; review-conflict) test_review_conflict ;;
      align-propose) test_align_propose ;; align-approve) test_align_approve ;;
      align-finalize) test_align_finalize ;;
      divergence-fixtures) test_divergence_fixtures ;;
      transcript-fixtures) test_transcript_fixtures ;;
      status) test_status ;; push-drift) test_push_drift ;;
      *) echo "Unknown: $2"; exit 1 ;;
    esac
  else
    test_init_founder; test_init_join; test_update_new; test_review_conflict
    test_align_propose; test_align_approve; test_align_finalize; test_status; test_push_drift; test_divergence_fixtures; test_transcript_fixtures
  fi
  print_summary
}
main "$@"
