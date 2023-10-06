import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MentionPos, MentionValue } from 'prosemirror-preset-mention';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionData, MentionService } from './mention.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  SubscriptionLike,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pmp-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MentionComponent implements OnInit, OnDestroy {
  private readonly _db = inject(MentionService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public focusedIndex = 0;

  public readonly keyword$ = new BehaviorSubject<string>('');
  public readonly filteredUsers$ = new BehaviorSubject<MentionData[] | -1>([]);
  public readonly subscriptions: SubscriptionLike[] = [];

  public ngOnInit(): void {
    const sub = this.keyword$
      .pipe(
        switchMap((keyword) => {
          this.filteredUsers$.next(-1);
          return this._db.fetch$(keyword).pipe(
            tap((data) => {
              this.filteredUsers$.next(data);
              this.focusedIndex = 0;
            }),
          );
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  public update(view: EditorView, prevState: EditorState): void {
    return;
  }

  public mentionPosChange(start: MentionPos): void {
    this.elementRef.nativeElement.style.top = start.top + 20 + 'px';
    this.elementRef.nativeElement.style.left = start.left + 'px';
  }

  public onKeywordChange(keyword: string): void {
    this.keyword$.next(keyword);
  }

  public arrowKeydown(event: KeyboardEvent) {
    if (this.filteredUsers$.getValue() === -1) {
      return;
    }
    if (event.key === 'ArrowUp') {
      this.focusedIndex = Math.max(0, this.focusedIndex - 1);
    } else if (event.key === 'ArrowDown') {
      this.focusedIndex = Math.min(this.focusedIndex + 1);
    }
  }

  public onSubmit(event: KeyboardEvent): MentionValue | null {
    const values = this.filteredUsers$.getValue();
    if (values === -1) {
      return null;
    }
    const target = values[this.focusedIndex];
    return {
      dataId: target.dataId,
      text: target.text,
    };
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
