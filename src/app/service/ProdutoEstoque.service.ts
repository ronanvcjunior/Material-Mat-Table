import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ProdutoEstoque } from '../model/produto.model'

@Injectable({
    providedIn: 'root'
})

export class ProdutoEstoqueService {
    urlBase: string = "http://localhost:4201/produtoEstoque"

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar
    ) { }

    showMessage(msg: string, isError: boolean = false): void {
        this.snackBar.open(msg, "Fechar",
        {
          verticalPosition:'top',
          horizontalPosition: 'right',
          duration: 3000,
          panelClass: isError ? ['msg-error'] : ['msg-success']
        }
        )
    
    }

    findAll() : Observable<ProdutoEstoque[]> {
        return this.http.get<ProdutoEstoque[]>(this.urlBase);
    }
}