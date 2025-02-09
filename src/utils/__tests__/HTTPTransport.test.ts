import HTTPTransport from '../HTTPTransport';
import { useFakeXMLHttpRequest, SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from 'sinon';

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let xhr: SinonFakeXMLHttpRequestStatic;
  let requests: SinonFakeXMLHttpRequest[];

  beforeEach(() => {
    xhr = useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = (req) => {
      requests.push(req);
    };
    http = new HTTPTransport('/test');
  });

  afterEach(() => {
    xhr.restore();
  });

  it('should send GET request', () => {
    const data = { test: 'test' };
    void http.get('/get', { data });

    expect(requests.length).toBe(1);
    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe('https://ya-praktikum.tech/api/v2/test/get?test=test');
  });

  it('should send POST request', () => {
    const data = { test: 'test' };
    void http.post('/post', {
      data
    });

    expect(requests.length).toBe(1);
    expect(requests[0].method).toBe('POST');
    expect(requests[0].url).toBe('https://ya-praktikum.tech/api/v2/test/post');
    expect(requests[0].requestBody).toBe(data);
  });

  it('should send PUT request', () => {
    const data = { test: 'test' };
    void http.put('/put', { data });

    expect(requests.length).toBe(1);
    expect(requests[0].method).toBe('PUT');
    expect(requests[0].url).toBe('https://ya-praktikum.tech/api/v2/test/put');
    expect(requests[0].requestBody).toBe(data);
  });

  it('should send DELETE request', () => {
    const data = { test: 'test' };
    void http.delete('/delete', { data });

    expect(requests.length).toBe(1);
    expect(requests[0].method).toBe('DELETE');
    expect(requests[0].url).toBe('https://ya-praktikum.tech/api/v2/test/delete');
    expect(requests[0].requestBody).toBe(data);
  });

  it('should resolve promise on successful request', async () => {
    const response = { status: 'ok' };
    const promise = http.get('/success');

    requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(response));

    const result = await promise;
    expect(result.responseText).toBe(JSON.stringify(response));
  });

  it('should reject promise on failed request', async () => {
    const promise = http.get('/error');

    requests[0].error();

    await expect(promise).rejects.toBeInstanceOf(xhr);
  });
});
