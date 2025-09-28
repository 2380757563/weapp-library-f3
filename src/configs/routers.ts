import HOME from '../pages/home.jsx';
import ADD_BOOK from '../pages/add-book.jsx';
import BOOK_DETAIL from '../pages/book-detail.jsx';
import LIBRARY from '../pages/library.jsx';
import SCAN from '../pages/scan.jsx';
import PROFILE from '../pages/profile.jsx';
import BOOK_DETAIL-EDIT from '../pages/book-detail-edit.jsx';
import INDEX from '../pages/index.jsx';
import ME from '../pages/me.jsx';
export const routers = [{
  id: "home",
  component: HOME
}, {
  id: "add-book",
  component: ADD_BOOK
}, {
  id: "book-detail",
  component: BOOK_DETAIL
}, {
  id: "library",
  component: LIBRARY
}, {
  id: "scan",
  component: SCAN
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "book-detail-edit",
  component: BOOK_DETAIL-EDIT
}, {
  id: "index",
  component: INDEX
}, {
  id: "me",
  component: ME
}]