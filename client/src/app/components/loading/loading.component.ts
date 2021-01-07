import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() public stop: boolean;
  public class: string;

  constructor(private _meta: Meta, private _render: Renderer2) {
    this._meta.updateTag({ property: 'og:description', content: 'Waiting for server...' });
    this._meta.addTag({ property: 'og:test', content: 'Meta Tag Test' });
  }

  public ngOnInit(): void {
    setInterval(() => {
      if (this.class === "remove") return;

      if (this.stop) {
        this.class = "remove";
        setTimeout(() => {
          document.querySelector("section").style.display = "none";
          this._render.destroy();
          console.log(this._render)
        }, 1500);
      }
    }, 500)
  }
}
