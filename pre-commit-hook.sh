#!/bin/sh
# Pre-commit hook for code formatting and linting

echo "Running pre-commit checks..."

# Get all staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx|ts|tsx|css|scss|json|md)$')

if [[ -z "$STAGED_FILES" ]]; then
  echo "No files to check."
  exit 0
fi

echo "Formatting files: $STAGED_FILES"

# Run Prettier on staged files
echo "$STAGED_FILES" | xargs npx prettier --write

# Add any modified files back to the staging area
echo "$STAGED_FILES" | xargs git add

# Run ESLint on JavaScript/JSX files
JS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx)$')
if [[ -n "$JS_FILES" ]]; then
  echo "Linting files: $JS_FILES"
  echo "$JS_FILES" | xargs npx eslint --fix
  
  # Add any modified files back to the staging area
  echo "$JS_FILES" | xargs git add
fi

# Run additional checks based on file types
for file in $STAGED_FILES; do
  if [[ $file == *.java ]]; then
    echo "Checking Java file: $file"
    # Optionally run checkstyle here if available
    # java -jar checkstyle.jar -c checkstyle.xml "$file"
  fi
done

echo "Pre-commit checks completed successfully!"
exit 0