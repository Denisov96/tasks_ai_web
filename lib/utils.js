export function booleanSort(prev, curr) {
    return prev === curr ? 0 : prev ? 1 : -1;
  }