import mapValues from 'lodash/mapValues';
import identity from 'lodash/identity';
import { StoreEnhancer } from 'redux';

export default function persistState(
  sessionId: string,
  deserializeState = identity,
  deserializeAction = identity
): StoreEnhancer {
  if (!sessionId) {
    return next => (...args) => next(...args);
  }

  function deserialize(state) {
    return {
      ...state,
      actionsById: mapValues(state.actionsById, liftedAction => ({
        ...liftedAction,
        action: deserializeAction(liftedAction.action)
      })),
      committedState: deserializeState(state.committedState),
      computedStates: state.computedStates.map(computedState => ({
        ...computedState,
        state: deserializeState(computedState.state)
      }))
    };
  }

  return next => (reducer, initialState) => {
    const key = `redux-dev-session-${sessionId}`;

    let finalInitialState;
    try {
      const json = localStorage.getItem(key);
      if (json) {
        finalInitialState = deserialize(JSON.parse(json)) || initialState;
        next(reducer, initialState);
      }
    } catch (e) {
      console.warn('Could not read debug session from localStorage:', e); // eslint-disable-line no-console
      try {
        localStorage.removeItem(key);
      } finally {
        finalInitialState = undefined;
      }
    }

    const store = next(reducer, finalInitialState);

    return {
      ...store,
      dispatch(action) {
        store.dispatch(action);

        try {
          localStorage.setItem(key, JSON.stringify(store.getState()));
        } catch (e) {
          console.warn('Could not write debug session to localStorage:', e); // eslint-disable-line no-console
        }

        return action;
      }
    };
  };
}
