import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
} from '@angular/core';
import { SearchDriver } from '@elastic/search-ui';
import config from '../search.config';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.scss'],
})
export class SearchSectionComponent implements OnInit {
  private driver!: SearchDriver;

  public searchState: any = {};

  public resultsPerPage: number | undefined = 20;
  public sortBy: string | undefined = 'relevance';
  public searchInputValue: string | undefined | null = '';
  public facets2: Record<string, any> = {};

  public get hasFacets(): boolean {
    return (
      this.searchState?.facets &&
      Object.keys(this.searchState.facets).length > 0
    );
  }

  public get thereAreResults() {
    return this.searchState?.totalResults && this.searchState.totalResults > 0;
  }

  public searchForm = this._formBuilder.group({
    searchInputValue: ['', Validators.required],
  });
  public initialized: boolean = false;

  constructor(private _formBuilder: FormBuilder) {
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.searchInputValue = this.searchForm.value.searchInputValue;
      if (this.searchInputValue) {
        this.driver.getActions().setSearchTerm(this.searchInputValue);
      }
    });
  }

  public ngOnInit(): void {
    this.driver = new SearchDriver(config);
    const { searchTerm, sortField, resultsPerPage, filters, facets } =
      this.driver.getState();

    this.searchInputValue = searchTerm;
    this.searchForm.patchValue({ searchInputValue: this.searchInputValue });
    this.sortBy = sortField;
    this.resultsPerPage = resultsPerPage;
    // permet d'initialiser la liste des facets'
    for (const facet in config.searchQuery.facets) {
      this.facets2[facet] = [];
    }
    // permet de laisser en vision l'ensemble des choix du facet et non seulement le choix sélectionné
    for (const facet of config.searchQuery.disjunctiveFacets) {
      this.facets2[facet] = [];
    }

    if (filters) {
      filters.forEach((filter) => {
        // TODO a adapater dans le futur pour reprendre les éléments deja filtrés ét présents dans la barre d'adresse si réactualisation
        if (facets[filter.field] !== undefined) {
          if (facets[filter.field][0].type === 'range') {
            this.facets2[filter.field] = filter.values.map(
              (value) => (<any>value).name
            );
          } else {
            this.facets2[filter.field] = filter.values;
          }
        } else {
          this.driver.clearFilters();
        }
      });
    }

    this.driver.subscribeToStateChanges((state) => {
      this.searchState = state;
    });
    this.initialized = true;
  }

  public handleFacetChange(event: any, facet: string): void {
    const { value, checked } = event.target;
    const facetFromDriver = this.driver.getState().facets[facet][0];
    const valueforApi =
      facetFromDriver.type === 'range'
        ? facetFromDriver.data.find(
            (item: { value: { name: any } }) => item.value.name === value
          ).value
        : value;

    if (checked) {
      this.facets2[facet].push(value);
      this.driver.addFilter(facet, valueforApi, 'any');
    } else {
      const index = this.facets2[facet].indexOf(value);
      if (index > -1) {
        this.facets2[facet].splice(index, 1);
      }
      this.driver.removeFilter(facet, valueforApi, 'any');
    }
  }

  public setCurrentPage(page: number) {
    this.driver.setCurrent(page);
  }

  // public resetFilter(event:any ) {
  //   const checked_list = document.querySelectorAll('input[type="checkbox"]:checked');
  //   checked_list.forEach(checked => {
  //     console.log(checked, checked.getAttribute('checked'))
  //     checked.setAttribute('checked', '')
  //     console.log(checked, checked.getAttribute('checked'))
  //   })
  //   this.driver.clearFilters()
  // }
}
