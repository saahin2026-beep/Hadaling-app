import { Component } from 'react';
import PrimaryButton from './PrimaryButton';
import Geel from './Geel';
import translations from '../utils/translations';
import { storage } from '../utils/storage';
import { reportError } from '../utils/observability';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    reportError(error, { componentStack: errorInfo?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      const lang = storage.get().language || 'so';
      const t = (key) => translations[lang]?.[key] || translations['so']?.[key] || key;

      return (
        <div style={{
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '24px',
          fontFamily: 'Nunito, sans-serif', background: 'white',
        }}>
          <Geel size={120} expression="encouraging" />
          <div style={{ height: 20 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#333', textAlign: 'center' }}>
            {t('error.title')}
          </h2>
          <p style={{ fontSize: 14, color: '#757575', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
            {t('error.message')}
          </p>
          {t('error.english') && (
            <p style={{ fontSize: 13, color: '#9E9E9E', textAlign: 'center', marginTop: 4 }}>
              {t('error.english')}
            </p>
          )}
          <div style={{ height: 24 }} />
          <PrimaryButton onClick={() => {
            this.setState({ hasError: false });
            window.location.href = '/home';
          }}>
            {t('error.button')}
          </PrimaryButton>
        </div>
      );
    }

    return this.props.children;
  }
}
