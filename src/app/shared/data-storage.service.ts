import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable()
export class DataStorageService {
    constructor(private http: Http, private recipesService: RecipeService) { }

    storeRecipes() {
        return this.http.put('firebaseURL/recipes.json', this.recipesService.getRecipes());
    }

    getRecipes() {
        this.http.get('firebaseURL/recipes.json')
            .pipe(map(
                (response: Response) => {
                    const recipes: Recipe[] = response.json();
                    for (const recipe of recipes) {
                        if (!recipe['ingredients']) {
                            recipe['ingredients'] = [];
                        }
                    }
                    return recipes;
                }
            ))
            .subscribe((recipes: Recipe[]) => {
                this.recipesService.setRecipes(recipes);
            });
    }
}
