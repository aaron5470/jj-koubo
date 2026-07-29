#!/usr/bin/env sh
set -eu

target="${1:-agents}"
scope="${2:-user}"
project_path="${3:-$PWD}"
force="${4:-}"

case "$target" in
  codex|claude|agents) ;;
  *)
    echo "Target must be codex, claude, or agents." >&2
    exit 1
    ;;
esac

case "$scope" in
  user|project) ;;
  *)
    echo "Scope must be user or project." >&2
    exit 1
    ;;
esac

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repository_root=$(dirname -- "$script_dir")
source_dir="$repository_root/jj"

if [ ! -f "$source_dir/SKILL.md" ]; then
  echo "Skill source not found: $source_dir" >&2
  exit 1
fi

if [ "$scope" = "user" ]; then
  if [ "$target" = "claude" ]; then
    skills_root="$HOME/.claude/skills"
  else
    skills_root="$HOME/.agents/skills"
  fi
else
  if [ ! -d "$project_path" ]; then
    echo "Project directory not found: $project_path" >&2
    exit 1
  fi

  if [ "$target" = "claude" ]; then
    skills_root="$project_path/.claude/skills"
  else
    skills_root="$project_path/.agents/skills"
  fi
fi

destination="$skills_root/jj"

if [ -e "$destination" ] && [ "$force" != "--force" ]; then
  echo "Skill already exists: $destination. Re-run with --force to update it." >&2
  exit 2
fi

mkdir -p "$destination"

(
  cd "$source_dir"
  tar \
    --exclude='node_modules' \
    --exclude='*/node_modules' \
    --exclude='.cache' \
    --exclude='*/.cache' \
    --exclude='.remotion' \
    --exclude='*/.remotion' \
    --exclude='out' \
    --exclude='*/out' \
    --exclude='dist' \
    --exclude='*/dist' \
    -cf - .
) | (
  cd "$destination"
  tar -xf -
)

echo "Installed jj for $target ($scope): $destination"
