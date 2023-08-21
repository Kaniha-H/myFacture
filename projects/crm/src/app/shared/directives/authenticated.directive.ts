import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[authenticated]',
})
export class AuthenticatedDirective {
  constructor(
    private template: TemplateRef<HTMLElement>,
    private container: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input('authenticated')
  value = true;
  subscription?: Subscription;

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.auth.authStatus$.subscribe((status) => {
      this.container.clear();

      if (status === this.value) {
        this.container.createEmbeddedView(this.template);
      }
    });
  }
}
