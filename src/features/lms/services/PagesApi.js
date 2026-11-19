import { mockPages } from "../../../data/mockStore";

/**
 * LMS Pages Service (Static JSON Data Layer)
 */
const PagesApi = {
  createPage: (pageData) => mockPages.createPage(pageData),
  getPages: (params) => mockPages.getPages(params),
  getAssignedPages: (roleId) => mockPages.getAssignedPages(roleId),
  updatePage: (pageId, pageData) => mockPages.updatePage(pageId, pageData),
  deletePage: (pageId) => mockPages.deletePage(pageId),
};

export default PagesApi;
