import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Habilidad{
  name: string,
  url: string
}


@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent implements OnInit, OnDestroy {

  selectedValue: string;
  pokemon: any = '';
  pokemonImg = '';
  pokemonType = [];
  habilidades = [];
  habilidad = '';
  pokemones = [];
  pokemonDropDown = '';

  constructor(private activatedRouter: ActivatedRoute, private pokemonService: PokemonService, private router: Router) {

    this.activatedRouter.params.subscribe(
      params => {
        this.getPokemon(params['id']);
      }
    )
  }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    if(this.serviceSubscription){
    this.serviceSubscription.unsubscribe();   
    }
  }
  private serviceSubscription: Subscription;

  getPokemon(id) {
    this.serviceSubscription = this.pokemonService.getPokemons(id).subscribe(
      res => {
        console.log(res);
        this.pokemon = res;
        this.pokemonImg = this.pokemon.sprites.front_default;
        this.pokemonType = res.types[0].type.name;
        console.log("Tamaño: " + res.abilities.length);
        for(let i= 0; i<res.abilities.length; i++){
          this.habilidades.push(res.abilities[i].ability.name);
        }
        console.log("Habilidades: " + this.habilidades);
        this.habilidad = this.habilidades[0];
        console.log("Habilidad inside: " + this.habilidad);
        this.getPokemons();
      },
      err => {
        console.log(err);
      }
    )
  }

  getPokemons(){
    console.log("Habilidad in method: " + this.habilidad);
    this.serviceSubscription = this.pokemonService.getPokemonsByAbility(this.habilidad).subscribe(
      res => {
        console.log(res.pokemon);
        console.log("Tamaño: " + res.pokemon.length);
        for(let i= 0; i<res.pokemon.length; i++){
          this.pokemones.push(res.pokemon[i].pokemon.name);
        }
        console.log(this.pokemones);
      }
    )
  }

  getPoke(pokemon){
    console.log("Pokemon: " + pokemon);
    //console.log(this.pokemonService.getPokemons(pokemon));
    //this.router.navigateByUrl(`/pokeDetail/${this.pokemonService.getPokemons(pokemon)}`)
    this.serviceSubscription = this.pokemonService.getPokemons(pokemon).subscribe(
      res => {
        console.log(res);
        this.pokemonDropDown = res.id;
        this.habilidades = [];
        this.router.navigateByUrl(`/pokeDetail/${this.pokemonDropDown}`)
      },
      err => {
        console.log(err);
      }
    )
  }
}
