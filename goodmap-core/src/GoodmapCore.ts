import { AxiosPromise } from 'axios';
import { IEntry, ISearchResult, IUserProfile } from './interfaces';
import Http from './services/Http';

export default class GoodmapCore {
  /**
   * Get compact entries separated by visibility for bbox
   * @param bbox
   */
  public static getCompactEntriesForBbox(
    bbox: Array<number[]>,
  ): AxiosPromise<ISearchResult> {
    const bboxParams = `${bbox[0][0]},${bbox[0][1]},${bbox[1][0]},${bbox[1][1]}`;
    return Http.get(`/search?bbox=${bboxParams}`);
  }

  /**
   * Create entry
   * @param entry
   */
  public static createEntry(entry: IEntry): AxiosPromise<IEntry> {
    return Http.post('/entries/', entry);
  }

  /**
   * Get entries by specific ids
   * @param ids
   */
  public static getEntriesByIds(ids: string[]): AxiosPromise<IEntry[]> {
    const idsParams = ids.join(',');
    return Http.get(`/entries/${idsParams}`);
  }

  /**
   * Get user profile
   * @param email
   */
  public static getUser(email: string): AxiosPromise<IUserProfile> {
    return Http.get(`/users/${email}`);
  }

  /**
   * Login user
   * @param email
   * @param password
   */
  public static loginUser(email: string, password: string): AxiosPromise<null> {
    return Http.post('/login', { email, password });
  }

  /**
   * Logout
   */
  public static logoutUser(): AxiosPromise<null> {
    return Http.post('/logout', null);
  }

  /**
   * Update entry
   * @param id
   * @param entry
   */
  public static updateEntry(id: string, entry: IEntry): AxiosPromise<IEntry> {
    return Http.put(`/entries/${id}`, entry);
  }
}
