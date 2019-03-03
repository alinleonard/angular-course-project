import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
    constructor(private http: Http, 
                private recipesService: RecipeService, 
                private authService: AuthService) { }

    storeRecipes() {
        const token = this.authService.getToken();

        return this.http.put('firbase/recipes.json?auth' + token, this.recipesService.getRecipes());
    }

    getRecipes() {
        const token = this.authService.getToken();
        console.log(token);
            
        this.http.get('firbase/recipes.json?auth=' + token)
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
