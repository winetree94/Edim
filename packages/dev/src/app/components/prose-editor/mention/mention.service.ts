import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { Observable, map, timer } from 'rxjs';

export interface MentionData {
  dataId: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class MentionService {
  public db: MentionData[] = Array.from({ length: 100 }).map(() => ({
    dataId: faker.string.uuid(),
    text: faker.person.fullName(),
  }));

  public fetch$(keyword?: string): Observable<MentionData[]> {
    return timer(300).pipe(
      map(() => {
        if (keyword) {
          return this.db.filter((item) =>
            item.text.toLowerCase().includes(keyword.toLowerCase()),
          );
        }
        return this.db;
      }),
    );
  }
}
