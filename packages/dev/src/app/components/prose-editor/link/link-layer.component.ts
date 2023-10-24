import { Component } from '@angular/core';
import { ProseLayerComponent } from 'src/app/components/layer/layer.component';

@Component({
  selector: 'prose-link-layer',
  templateUrl: './link-layer.component.html',
  styleUrls: ['./link-layer.component.scss'],
  standalone: true,
  imports: [ProseLayerComponent],
})
export class ProseEditorLinkLayerComponent {}
