import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Paquete } from '../../../auth/pages.adm/Paquetes/Paquete.interface';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
  standalone: false
})
export class PaypalComponent implements OnInit {
  paqueteId: string | null = null;
  paquete: Paquete | undefined;
  amount: string = '10.00'; // Ajusta el monto según el paquete seleccionado

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.paqueteId = this.route.snapshot.paramMap.get('paqueteId');
    if (this.paqueteId) {
      this.loadPaqueteDetails(this.paqueteId);
    }
    this.loadPayPalScript();
  }

  private loadPaqueteDetails(paqueteId: string) {
    this.http.get<Paquete>(`https://viajesumback.onrender.com/Paquetes/${paqueteId}`).subscribe(
      (data) => {
        this.paquete = data;
        if (this.paquete && this.paquete.costo) {
          this.amount = this.paquete.costo.toString(); 
        } else {
          console.error('El paquete no tiene un costo definido');
        }
      },
      (error) => {
        console.error('Error al cargar los detalles del paquete:', error);
      }
    );
  }

  loadPayPalScript() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AUlbK4mKpNVWGd7hromw3H9c-DrroWugIAzT9mimgNOli39YPozvYX811v-w6SjvGQd97H8yVgbks23L`;
    script.onload = () => this.initPayPalButtons();
    document.body.appendChild(script);
  }

  initPayPalButtons() {
    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.amount
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          // Enviar correo electrónico al cliente
          this.sendEmailToCustomer(details); 

          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      }
    }).render('#paypal-button-container');
  }

  sendEmailToCustomer(details: any) {
    if (!this.paquete || !this.paqueteId) {
      console.error('No se puede enviar el correo electrónico. Falta información del paquete.');
      return;
    }

    const emailData = {
      to: details.payer.email_address, // Asegúrate de que PayPal te devuelve la dirección de correo electrónico
      subject: 'Confirmación de compra de paquete',
      body: `
        Hola ${details.payer.name.given_name},

        Gracias por tu compra!

        Detalles de tu pedido:

        * **Paquete:** ${this.paquete.nombre}
        * **ID de transacción:** ${details.id}
        * **Monto:** ${this.amount}
        * **Fecha:** ${new Date().toLocaleDateString()}

        Puedes acceder a tu paquete en [enlace a tu aplicación o plataforma].

        Saludos,

        Tu equipo
      `
    };

    // Reemplaza esto con tu lógica para enviar correos electrónicos
    this.http.post('https://viajesumback.onrender.com/sendemail', emailData).subscribe(
      (response) => console.log('Correo electrónico enviado con éxito:', response),
      (error) => console.error('Error al enviar el correo electrónico:', error)
    );
  }
}