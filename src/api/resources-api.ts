import HTTP from '@/utils/HTTPTransport';

const resourcesHTTP = new HTTP('/resources');

type SendFileResult = {
  'id': number;
  'user_id': number;
  'path': string;
  'filename': string;
  'content_type': string;
  'content_size': number;
  'upload_date': string;
};

class ResourcesApi {
  async sendFile(data: FormData) {
    const res = await resourcesHTTP.post('/', {
      data
    });

    return JSON.parse(res.response as string) as SendFileResult;
  }
}

export default new ResourcesApi;
