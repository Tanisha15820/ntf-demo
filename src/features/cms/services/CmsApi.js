import { mockCms, toResponse } from "../../../data/mockStore";

const CmsApi = {
  getCategories: () => mockCms.getCategories(),
  getContents: () => mockCms.getContents(),
  getContentsAsync: () => toResponse(mockCms.getContents()),
  createContent: (payload) => mockCms.createContent(payload),
  updateContent: (id, payload) => mockCms.updateContent(id, payload),
  deleteContent: (id) => mockCms.deleteContent(id),
};

export default CmsApi;
