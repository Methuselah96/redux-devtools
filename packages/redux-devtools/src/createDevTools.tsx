import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider, ReactReduxContext } from 'react-redux';
import instrument, {
  InstrumentExt,
  LiftedStore,
  Options
} from 'redux-devtools-instrument';
import { Action, Store } from 'redux';

function logError(type: string) {
  if (type === 'NoStore') {
    console.error(
      'Redux DevTools could not render. You must pass the Redux store ' +
        'to <DevTools> either as a "store" prop or by wrapping it in a ' +
        '<Provider store={store}>.'
    );
  } else {
    console.error(
      'Redux DevTools could not render. Did you forget to include ' +
        'DevTools.instrument() in your store enhancer chain before ' +
        'using createStore()?'
    );
  }
}

interface Props<S, A extends Action> {
  store: Store<S, A> & InstrumentExt<S, A>;
}

export default function createDevTools<S, A extends Action>(
  children: React.ReactElement<unknown, React.JSXElementConstructor<unknown>>
) {
  const monitorElement = Children.only(children)!;
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const ConnectedMonitor = connect(
    (state: Store<S, A> & InstrumentExt<S, A>) => state
  )(Monitor);

  return class DevTools extends Component<Props<S, A>> {
    static contextTypes = {
      store: PropTypes.object
    };

    static propTypes = {
      store: PropTypes.object
    };

    liftedStore?: LiftedStore<S, A>;

    static instrument = (options: Options<S, A>) =>
      instrument(
        (state, action) => Monitor.update(monitorProps, state, action),
        options
      );

    constructor(props: Props<S, A>, context) {
      super(props, context);

      if (ReactReduxContext) {
        if (this.props.store && !this.props.store.liftedStore) {
          logError('NoLiftedStore');
        }
        return;
      }

      if (!props.store && !context.store) {
        logError('NoStore');
        return;
      }

      if (context.store) {
        this.liftedStore = context.store.liftedStore;
      } else {
        this.liftedStore = props.store.liftedStore;
      }

      if (!this.liftedStore) {
        logError('NoLiftedStore');
      }
    }

    render() {
      if (ReactReduxContext) {
        // For react-redux@6
        if (this.props.store) {
          if (!this.props.store.liftedStore) {
            return null;
          }
          return (
            <Provider store={this.props.store.liftedStore}>
              <ConnectedMonitor {...monitorProps} />
            </Provider>
          );
        }
        return (
          <ReactReduxContext.Consumer>
            {props => {
              if (!props || !props.store) {
                logError('NoStore');
                return null;
              }
              if (!props.store.liftedStore) {
                logError('NoLiftedStore');
                return null;
              }
              return (
                <Provider store={props.store.liftedStore}>
                  <ConnectedMonitor {...monitorProps} />
                </Provider>
              );
            }}
          </ReactReduxContext.Consumer>
        );
      }

      if (!this.liftedStore) {
        return null;
      }

      return <ConnectedMonitor {...monitorProps} store={this.liftedStore} />;
    }
  };
}
