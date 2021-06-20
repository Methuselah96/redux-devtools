import { combineReducers } from 'redux';
import instances from '@redux-devtools/app/lib/reducers/instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import reports from '@redux-devtools/app/lib/reducers/reports';
import section from '@redux-devtools/app/lib/reducers/section';
import theme from '@redux-devtools/app/lib/reducers/theme';
import connection from '@redux-devtools/app/lib/reducers/connection';
import socket from '@redux-devtools/app/lib/reducers/socket';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import { StoreAction } from '@redux-devtools/app/lib/actions';

const rootReducer = combineReducers<StoreState, StoreAction>({
  instances,
  monitor,
  reports,
  notification,
  section,
  theme,
  connection,
  socket,
});

export default rootReducer;