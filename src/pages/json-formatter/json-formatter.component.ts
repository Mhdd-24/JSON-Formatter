import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { LeftPanelComponent } from '../../shared/component/left-panel/left-panel.component';
import { RightPanelComponent } from "../../shared/component/right-panel/right-panel.component";

@Component({
  selector: 'app-json-formatter',
  imports: [HeaderComponent, FooterComponent, LeftPanelComponent, RightPanelComponent],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.css'
})
export class JsonFormatterComponent {
  public JSONHeader = signal('JSON Formatter');
  public JSONFooter = signal('@Mohammed Rafi');

}
