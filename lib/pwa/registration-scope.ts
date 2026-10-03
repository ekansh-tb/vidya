/** Only the public child app installs a learning-shell worker. */
export function canRegisterLearningWorker(hostname: string, pathname: string) {
  return pathname === "/" && !["parents.vidyagyan.study", "teacher.vidyagyan.study"].includes(hostname);
}
