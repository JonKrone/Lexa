# Text Replacement Testing Strategy

## Context & Problem Statement

### What We're Building

Lexa is a language learning browser extension that dynamically replaces text on web pages with translations. The core challenge is reliably finding and replacing specific text segments in the DOM while preserving the original page structure and functionality.

### Current Architecture

```
HTML Page → Markdown Conversion → LLM Translation → DOM Text Replacement
```

**Key Components:**

- `replaceTextSegments()` - Main orchestration function
- `buildTextMap()` - Creates flattened text representation for cross-element searching
- `findWordBoundaryMatches()` - Locates text with word boundaries to prevent partial matches
- `mapNormalizedToOriginalPosition()` - Maps normalized search positions back to original text
- `mountLexaRoot()` - Replaces text with React components

### Current Issues

#### 1. Position Mapping Bug

**Symptom:** `"the same"` → `"thfuncionanme"` when trying to replace "work" with "funcionan"
**Root Cause:** `mapNormalizedToOriginalPosition()` is calculating incorrect Range boundaries
**Impact:** Text corruption, wrong text being replaced

#### 2. Cross-Element Text Spans

**Status:** Intentionally not implemented yet (Phase 2)
**Example:** `"host <strong>page</strong>"` - text spanning multiple DOM nodes

#### 3. Dynamic Content

**Status:** No MutationObserver yet (Phase 2)
**Impact:** New content after page load isn't processed

## Solution Approaches

### What We're Doing ✅

#### Flattened Offset Mapping

- Concatenate all text nodes into single searchable string
- Maintain mapping between global positions and individual DOM nodes
- Enables cross-element text searching without complex DOM traversal

#### Word Boundary Detection

- Use regex `\b` boundaries to prevent partial word matches
- Find ALL potential matches, then select best based on context
- Solves "work" vs "frameworks" problem

#### Simplified Normalization

- Only collapse whitespace and lowercase (no punctuation stripping)
- Reduces index mapping complexity
- More predictable text transformations

#### Reverse-Order Processing

- Process matches from end to start of document
- Prevents index shifting during DOM mutations
- Maintains position accuracy during batch replacements

### What We're NOT Doing ❌

#### Complex AST/Parser Approaches

**Why Not:** Over-engineering for current needs
**Alternative:** Simple string operations with careful position tracking

#### Third-Party Text Processing Libraries

**Why Not:** Want to understand and control the exact behavior
**Alternative:** Custom lightweight functions tailored to our use case

#### Multi-Node Span Support (Yet)

**Why Not:** Adds significant complexity, most text is single-node
**Plan:** Phase 2 feature after core reliability is achieved

#### Real-Time DOM Watching

**Why Not:** Performance concerns, complexity
**Plan:** Phase 2 with debounced MutationObserver

## Testing Strategy

### Core Principles

1. **Isolate Pure Functions** - Test string processing logic separately from DOM
2. **Test the Bug First** - Start with failing cases to drive development
3. **Realistic Test Data** - Use actual problematic translations and HTML
4. **Fast Feedback Loop** - Unit tests should run in milliseconds

### Test Architecture

```
src/lib/__tests__/
├── replaceTextSegments.test.ts          # Integration tests
├── textMatching.test.ts                 # Core matching logic
├── positionMapping.test.ts              # Position calculation
├── fixtures/
│   ├── translations.ts                  # Test translation data
│   ├── htmlSamples.ts                   # HTML test cases
│   └── problemCases.ts                  # Known failing scenarios
└── utils/
    ├── mockDOM.ts                       # DOM testing utilities
    └── testHelpers.ts                   # Common test patterns
```

### Testing Layers

#### Layer 1: Pure String Functions (Highest Priority)

**Target:** `mapNormalizedToOriginalPosition()`, `findWordBoundaryMatches()`, `normalizeText()`
**Why:** These contain the core logic bugs and are easiest to test

```typescript
// Example test structure
describe('mapNormalizedToOriginalPosition', () => {
  test('current bug case', () => {
    const originalText = 'frameworks like React and Vue work in content scripts'
    const target = 'work'
    const normalizedPosition = 35 // position of "work" in normalized text

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).toEqual({ start: 35, end: 39 })
    expect(originalText.substring(result.start, result.end)).toBe('work')
  })
})
```

#### Layer 2: Text Map Construction

**Target:** `buildTextMap()` with mock DOM nodes
**Focus:** Offset calculations, node boundary handling

#### Layer 3: Integration Tests

**Target:** Full `replaceTextSegments()` pipeline
**Focus:** End-to-end behavior with real DOM

#### Layer 4: Edge Cases & Regression Tests

**Target:** Known problematic scenarios
**Focus:** Prevent future breakage

### Implementation Plan

#### Phase 1: Debug Current Bug (Week 1)

1. **Create failing test** for "work" → "thfuncionanme" bug
2. **Add detailed logging** to `mapNormalizedToOriginalPosition()`
3. **Fix position mapping** algorithm
4. **Verify fix** with test

#### Phase 2: Core Function Coverage (Week 1-2)

1. **Unit tests** for all pure string functions
2. **Mock DOM utilities** for `buildTextMap()` testing
3. **Edge case tests** for word boundaries, whitespace, punctuation

#### Phase 3: Integration & Regression (Week 2)

1. **Integration tests** with real DOM elements
2. **Regression test suite** for known issues
3. **Performance benchmarks** for large pages

#### Phase 4: Advanced Scenarios (Future)

1. **Multi-node span tests** (when implemented)
2. **Dynamic content tests** (when MutationObserver added)
3. **Cross-browser compatibility** tests

### Test Data Strategy

#### Realistic Problem Cases

```typescript
export const problemTranslations = [
  {
    name: 'work-in-frameworks',
    original: 'work',
    translation: 'funcionan',
    context: 'frameworks like React and Vue work in content',
    html: '<p>In addition, frameworks like React and Vue work in content scripts.</p>',
    expectedResult: 'frameworks like React and Vue funcionan in content',
  },
  // More cases...
]
```

#### Edge Case Scenarios

- Empty strings
- Single character matches
- Text at element boundaries
- Multiple consecutive spaces
- Special characters and punctuation
- Non-English text

### Success Metrics

#### Reliability

- **100% success rate** on core test cases
- **Zero text corruption** (no "thfuncionanme" scenarios)
- **Correct word boundary detection** (no partial matches)

#### Performance

- **<10ms** for typical page processing
- **<100ms** for large pages (10k+ words)
- **Memory efficient** (no memory leaks from DOM references)

#### Maintainability

- **Clear test failure messages** that point to exact issue
- **Easy to add new test cases** for future problems
- **Fast test execution** for rapid iteration

## Risk Mitigation

### High-Risk Areas

1. **Position mapping complexity** - Most likely source of bugs
2. **Regex edge cases** - Word boundaries with special characters
3. **DOM mutation timing** - Race conditions with dynamic content

### Mitigation Strategies

1. **Comprehensive position mapping tests** with detailed logging
2. **Regex test suite** with international text samples
3. **Graceful degradation** when position mapping fails

## Future Considerations

### Multi-Node Spans (Phase 2)

- Will require more complex Range creation
- Test strategy: Mock DOM with split text nodes
- Success metric: Handle `"host <strong>page</strong>"` correctly

### Performance Optimization (Phase 3)

- Consider Aho-Corasick for multiple pattern matching
- Test strategy: Benchmark with large translation sets
- Success metric: Sub-linear scaling with translation count

### Internationalization (Phase 4)

- Test with non-Latin scripts (Arabic, Chinese, etc.)
- Word boundary behavior varies by language
- Success metric: Reliable operation across language families

---

**Next Steps:**

1. Implement failing test for current bug
2. Add detailed logging to position mapping
3. Fix the algorithm
4. Expand test coverage systematically
