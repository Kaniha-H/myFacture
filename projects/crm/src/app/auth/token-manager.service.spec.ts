import {
  LocalStorageTokenManager,
  SessionStorageTokenManager,
} from './token-manager.service';

describe('LocalStrorageTokenManager', () => {
  let service: LocalStorageTokenManager;
  beforeEach(() => {
    service = new LocalStorageTokenManager();
    window.localStorage.removeItem('authToken');
  });
  it('should store token in localStorage and return an observable of the token', (done: DoneFn) => {
    service.storeToken('MOCK_TOKEN').subscribe((token) => {
      expect(token).toBe('MOCK_TOKEN');
      done();
    });

    expect(window.localStorage.getItem('authToken')).toBe('MOCK_TOKEN');
  });

  it('should load a token from the localStorage (if there is one)', (done: DoneFn) => {
    window.localStorage.setItem('authToken', 'MOCK_TOKEN');

    service.loadToken().subscribe((token) => {
      expect(token).toBe('MOCK_TOKEN');
      done();
    });
  });

  it('should load null if no token in the localStorage', (done: DoneFn) => {
    service.loadToken().subscribe((token) => {
      expect(token).toBe(null);
      done();
    });
  });

  it('should remove token from localStorage', (done: DoneFn) => {
    window.localStorage.setItem('authToken', 'MOCK_TOKEN');

    service.removeToken().subscribe(() => {
      expect(window.localStorage.getItem('authToken')).toBe(null);
      done();
    });
  });
});

describe('SessionStrorageTokenManager', () => {
  let service: SessionStorageTokenManager;
  beforeEach(() => {
    service = new SessionStorageTokenManager();
    window.sessionStorage.removeItem('authToken');
  });
  it('should store token in sessionStorage and return an observable of the token', (done: DoneFn) => {
    service.storeToken('MOCK_TOKEN').subscribe((token) => {
      expect(token).toBe('MOCK_TOKEN');
      done();
    });

    expect(window.sessionStorage.getItem('authToken')).toBe('MOCK_TOKEN');
  });

  it('should load a token from the sessionStorage (if there is one)', (done: DoneFn) => {
    window.sessionStorage.setItem('authToken', 'MOCK_TOKEN');

    service.loadToken().subscribe((token) => {
      expect(token).toBe('MOCK_TOKEN');
      done();
    });
  });

  it('should load null if no token in the sessionStorage', (done: DoneFn) => {
    service.loadToken().subscribe((token) => {
      expect(token).toBe(null);
      done();
    });
  });

  it('should remove token from sessionStorage', (done: DoneFn) => {
    window.sessionStorage.setItem('authToken', 'MOCK_TOKEN');

    service.removeToken().subscribe(() => {
      expect(window.sessionStorage.getItem('authToken')).toBe(null);
      done();
    });
  });
});
