import {  AfterViewInit, Component, OnInit, ViewChild } from '@angular/core' 
import { MatPaginator } from '@angular/material/paginator' 
import { MatDialog } from '@angular/material/dialog' 
import { MatTableDataSource } from '@angular/material/table' 
import { MatSort, Sort } from '@angular/material/sort' 
import { ProdutoEstoque } from './model/produtoEstoque.model'
import { ProdutoEstoqueService } from '../app/service/ProdutoEstoque.service'
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  filterValue!: string

  produtoEstoques: ProdutoEstoque[] = []

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

  atualizarDadosPage(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)

    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
              startWith({}),
              switchMap(() => {
                this.isLoadingResults = true;
                return this.service.findAllPaginator(
                      this.sort.active, 
                      this.sort.direction, 
                      this.paginator.pageIndex, 
                      this.paginator.pageSize,
                      this.filterValue
                ).pipe(catchError(() => observableOf(null)))
              }),
              map(data => {
                  this.isLoadingResults = false
                  this.isRateLimitReached = data ===null
                  console.log(data)
                  if (data === null) {
                    return []
                  }

                  this.resultsLength = data.totalElements
                  return data.content
                })
        ).subscribe((produtos => {
      this.dataSource = new MatTableDataSource(produtos)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      console.log(produtos)
    }))

  }

  ngAfterViewInit() {
    this.atualizarDadosPage()
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase()
    // this.dataSource.filter = this.filterValue
    this.atualizarDadosPage()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage() 
    }
  }

}
