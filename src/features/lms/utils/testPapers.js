import { mockLms } from "../../../data/mockStore";

const TEST_PAPERS_KEY = "ntf_test_papers";

export const getSavedPapers = () => {
  try {
    const raw = localStorage.getItem(TEST_PAPERS_KEY);
    if (!raw) {
      const seeded = mockLms.getSeedTestPapers();
      localStorage.setItem(TEST_PAPERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    const seeded = mockLms.getSeedTestPapers();
    localStorage.setItem(TEST_PAPERS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return mockLms.getSeedTestPapers();
  }
};

export const savePaperToStore = (paper) => {
  try {
    const papers = getSavedPapers();
    const existing = papers.find((p) => p.id === paper.id);
    const updated = existing
      ? papers.map((p) =>
          p.id === paper.id
            ? { ...p, ...paper, updatedAt: Date.now() }
            : p
        )
      : [
          ...papers,
          { ...paper, createdAt: Date.now(), updatedAt: Date.now() },
        ];
    localStorage.setItem(TEST_PAPERS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};
