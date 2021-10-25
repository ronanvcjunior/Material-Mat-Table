import {  Component, OnInit, ViewChild } from '@angular/core' 
import { MatPaginator } from '@angular/material/paginator' 
import { MatDialog } from '@angular/material/dialog' 
import { MatTableDataSource } from '@angular/material/table' 
import { MatSort, Sort } from '@angular/material/sort' 
import { ProdutoEstoque } from '../app/model/produto.model'
import { ProdutoEstoqueService } from '../app/service/ProdutoEstoque.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  displayedColumns: string[] = ['idProdutoEstoque', 'grupo', 'nmProduto', 'prUnitario', 'qtdEstoque', 'qtdReservada'] 
  dataSource!: MatTableDataSource<ProdutoEstoque> 

  @ViewChild(MatPaginator) paginator!: MatPaginator 
  @ViewChild(MatSort) sort!: MatSort 

  constructor( 
    private service: ProdutoEstoqueService,

  ) { }

  formatar(n: number) {
    return n.toFixed(2).replace('.', ',')
  }

  atualizarDados(): void{
    this.service.findAll().subscribe(produtos => {
      this.dataSource = new MatTableDataSource(produtos)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })

  }

  ngOnInit() {
    this.atualizarDados()  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value 
    this.dataSource.filter = filterValue.trim().toLowerCase() 

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage() 
    }
  }

}
