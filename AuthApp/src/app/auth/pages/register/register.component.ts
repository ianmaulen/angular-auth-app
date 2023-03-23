import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miRegister: FormGroup = this.fb.group({
    name: ['test 1', [Validators.required, Validators.minLength(3)]],
    email: ['test1@test.com', [Validators.required, Validators.email] ],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  })

  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService ) {}

  register() {
    console.log(this.miRegister.value)
    // this.router.navigate(['/login']);
    const { name, email, password } = this.miRegister.value;

    this.authService.register(name, email, password)
    .subscribe( res => {
      
    })

  }
}

//if( res === true ) {
//   this.router.navigate(['/login']);
// }
// console.log(res);