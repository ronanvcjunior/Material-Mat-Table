import { AfterViewInit, Component, ViewChild } from '@angular/core' 
import { MatPaginator } from '@angular/material/paginator' 
import { MatSort } from '@angular/material/sort' 
import { MatTableDataSource } from '@angular/material/table' 

export interface ProdutoData {
  id: number 
  grupo: string 
  name: string 
  valor: number 
  unidadeMedida: string 
  qtdEstoque: string 
  qtdReservada: string 
}

const GRUPO: string[] = [
  'ALVENARIA', 'PINTURA', 'REVESTIMENTO', 'LOUCAS', 'ESQUADRIAS', 'TELHADO'
] 

const UNIDADE_MEDIDA: string[] = [
  'Unidade', 'Litro', 'Kilo', 'Caixa', 'Saco', 'Metro'
] 

const NAMES: string[] = [
  'Emboço', 'Reboco', 'Vergalhões', 'Quadro de distribuição', 'Tijolos', 'Areia', 'Tubos de PVC', 'Graute', 'Cimento', 'Argamassa para chapisco',
  'Caixas de luz', 'azulejos', 'portas', 'interruptores', 'metais de louça', 'portas', 'revestimentos internos e externos', 'esquadrias', 'tinta'
] 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'grupo', 'name', 'valor', 'qtdEstoque', 'qtdReservada', 'editar'] 
  dataSource: MatTableDataSource<ProdutoData> 

  @ViewChild(MatPaginator) paginator!: MatPaginator 
  @ViewChild(MatSort) sort!: MatSort 

  constructor() {
    
    const produtos = Array.from({ length: 100 }, (_, k) => createNewProduto(k + 1)) 

    this.dataSource = new MatTableDataSource(produtos) 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator 
    this.dataSource.sort = this.sort 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value 
    this.dataSource.filter = filterValue.trim().toLowerCase() 

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage() 
    }
  }
}

function createNewProduto(id: number): ProdutoData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))]

  let maiorValor = Math.round(Math.random() * 100)
  let menorValor = Math.round(Math.random() * 100)
  while (maiorValor == menorValor) {
    maiorValor = Math.round(Math.random() * 100)
    menorValor = Math.round(Math.random() * 100)
  } 

  if (menorValor > maiorValor) {
    let x = maiorValor
    maiorValor = menorValor
    menorValor = x
  }

  return {
    id: id,
    name: name,
    valor: parseFloat((Math.random() * 100).toFixed(2)),
    unidadeMedida: UNIDADE_MEDIDA[Math.round(Math.random() * (UNIDADE_MEDIDA.length - 1))],
    grupo: GRUPO[Math.round(Math.random() * (GRUPO.length - 1))],
    qtdEstoque: maiorValor.toString(),
    qtdReservada: menorValor.toString()
  } 
}
