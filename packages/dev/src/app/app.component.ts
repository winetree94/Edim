import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProseEditorComponent } from 'src/app/components/prose-editor/prose-editor.component';
import { GlobalService } from 'src/app/global.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { data, data2 } from 'src/app/data';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProseEditorComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public globalService = inject(GlobalService);
  public enable = true;

  public readonly formGroup = new FormGroup({
    content: new FormControl<string>(JSON.stringify(data), {
      nonNullable: true,
    }),
  });

  public values$ = this.formGroup.controls.content.valueChanges.pipe(
    startWith(this.formGroup.controls.content.value),
    map((value) => JSON.stringify(JSON.parse(value), null, 4)),
  );

  public updateValue(): void {
    this.formGroup.controls.content.patchValue(JSON.stringify(data2));
  }
}
