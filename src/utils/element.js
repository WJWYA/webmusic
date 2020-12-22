import {
  Input,
  Loading,
  Carousel,
  CarouselItem,
  Pagination,
  Message,
  Tabs,
  TableColumn,
  Table,
  Button,
  TabPane,
  MessageBox,
} from 'element-ui';

export default {
  install(Vue) {
    Vue.use(Input);
    Vue.use(Loading);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Button);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox;
  }
};
