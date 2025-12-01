import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class HomePage {
  todos: {id: number, title: string, completed: boolean}[] = [];
  newTodoTitle: string = '';

  constructor(private alertController: AlertController) {
    // Načíst uložené úkoly
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos = JSON.parse(saved);
    }
  }

  // PŘIDAT ÚKOL
  addTodo() {
    if (this.newTodoTitle.trim() === '') return;

    this.todos.unshift({
      id: Date.now(),
      title: this.newTodoTitle.trim(),
      completed: false
    });

    this.saveToStorage();
    this.newTodoTitle = '';
  }

  // SMAZAT ÚKOL
  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveToStorage();
  }

  // EDITOVAT ÚKOL
  async editTodo(todo: any) {
    const alert = await this.alertController.create({
      header: 'Upravit úkol',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: todo.title,
          placeholder: 'Název úkolu'
        }
      ],
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Uložit',
          handler: (data) => {
            if (data.title.trim()) {
              todo.title = data.title.trim();
              this.saveToStorage();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // PŘEPNOUT STAV
  toggleTodo(todo: any) {
    todo.completed = !todo.completed;
    this.saveToStorage();
  }

  // SMAZAT HOTOVÉ
  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveToStorage();
  }

  // POČET HOTOVÝCH
  getCompletedCount() {
    return this.todos.filter(todo => todo.completed).length;
  }

  // ULOŽIT DO STORAGE
  private saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
