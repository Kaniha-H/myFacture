import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticatedDirective } from './directives/authenticated.directive';

@NgModule({
  declarations: [AuthenticatedDirective],
  imports: [CommonModule],
  exports: [AuthenticatedDirective],
})
export class SharedModule {}
