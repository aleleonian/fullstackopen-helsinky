import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';


ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

  
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
