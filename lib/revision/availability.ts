export function scienceCourseAvailable(board?: string | null, grade?: number | null) {
  return board === "cambridge-lower-secondary" && grade === 6;
}
