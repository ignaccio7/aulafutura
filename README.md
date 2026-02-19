Comandos a ejecutar

Ejecutar las migraciones y los seeders
```bash
php artisan migrate:fresh --seed
```

> Nota. Importante siempre ejecutar `git pull origin master` esto antes de crearse una nueva rama

Para crear una rama
```bash
git branch nombre-rama
git switch nombre-rama
```

Para pushear una rama
```bash
git push -u origin nombre-rama
```

Convenientemente usar feat/nombre-rama