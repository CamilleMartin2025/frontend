import { Component, OnInit } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="page-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App implements OnInit {

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}




