import { NgModule } from '@angular/core';
import { MentionComponent } from './elements/mention.component';
import { ProseEditorComponent } from './prose-editor.component';

@NgModule({
  imports: [MentionComponent, ProseEditorComponent],
  exports: [ProseEditorComponent],
})
export class ProseEditorModule {}
