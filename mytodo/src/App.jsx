import React from "react";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      task: "",
      description: "",
      severity: "Не срочно",
      todos: [],
      showOnlyUncompleted: false,
      searchQuery: "",
      selectedSeverities: [],
      taskCount: 0,
      taskError: "",
    };
  }

  componentDidMount() {
    console.log("Компонент смонтирован");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.todos.length !== this.state.todos.length) {
      console.log("Список задач обновлен");
    }
  }

  handleTaskChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSeverityChange = (level) => {
    this.setState({ severity: level });
  };

  handleTodoAdd = () => {
    const { task, description, severity, todos } = this.state;
    if (task.trim() === "") {
      this.setState({ taskError: "Имя задачи не может быть пустым!" });
      return;
    }

    const newTodo = {
      id: Date.now(),
      name: task,
      description,
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity,
    };

    this.setState((prevState) => ({
      task: "",
      description: "",
      severity: "Не срочно",
      todos: [newTodo, ...prevState.todos],
      taskError: "",
      taskCount: prevState.taskCount + 1,
    }));
  };

  handleTodoChecked = (id) => (e) => {
    const updatedTodos = this.state.todos.map((todo) =>
      todo.id === id ? { ...todo, checked: e.target.checked } : todo
    );
    this.setState({ todos: updatedTodos });
  };

  handleTodoDelete = (id) => () => {
    const updatedTodos = this.state.todos.filter((todo) => todo.id !== id);
    this.setState({ todos: updatedTodos });
  };

  handleFilterChange = (e) => {
    this.setState({ showOnlyUncompleted: e.target.checked });
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value.toLowerCase() });
  };

  handleSeveritySelect = (severity) => {
    const { selectedSeverities } = this.state;
    if (selectedSeverities.includes(severity)) {
      this.setState({
        selectedSeverities: selectedSeverities.filter((s) => s !== severity),
      });
    } else {
      this.setState({ selectedSeverities: [...selectedSeverities, severity] });
    }
  };

  generateTasks = () => {
    const { todos } = this.state;
    const newTodos = Array.from({ length: 1000 }, (_, index) => ({
      id: Date.now() + index,
      name: `Задача ${index + 1}`,
      description: `Описание задачи ${index + 1}`,
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity: "Не срочно",
    }));

    this.setState({ todos: [...todos, ...newTodos] });
  };

  render() {
    const {
      task,
      description,
      severity,
      todos,
      showOnlyUncompleted,
      searchQuery,
      selectedSeverities,
      taskError,
    } = this.state;

    const filteredTodos = todos.filter((todo) => {
      if (showOnlyUncompleted && todo.checked) return false;
      if (
        searchQuery &&
        !(
          todo.name.toLowerCase().includes(searchQuery) ||
          todo.description.toLowerCase().includes(searchQuery)
        )
      )
        return false;
      if (
        selectedSeverities.length > 0 &&
        !selectedSeverities.includes(todo.severity)
      )
        return false;
      return true;
    });

    const completedTodos = filteredTodos.filter((todo) => todo.checked);
    const uncompletedTodos = filteredTodos.filter((todo) => !todo.checked);

    return (
      <div>
        <div className="header">
          <h1>TODOIST</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={this.handleSearchChange}
            placeholder="Поиск"
            className="search-input"
          />
        </div>
        <div className="stats">
          <span>Всего: {todos.length}</span>
          <span>Сделано: {completedTodos.length}</span>
          <span>Осталось: {uncompletedTodos.length}</span>
        </div>
        <div className="add-task-container">
          <div className="add-task">
            <div className="task-input">
              <div className="input-container">
                <input
                  type="text"
                  value={task}
                  onChange={this.handleTaskChange}
                  placeholder="Введите название задачи"
                />
                <button onClick={this.handleTodoAdd} style={{ marginLeft: 10 }}>
                  Добавить
                </button>
              </div>
              {taskError && <p className="error-message">{taskError}</p>}
            </div>
          </div>
          <div className="add-description">
            <textarea
              value={description}
              onChange={this.handleDescriptionChange}
              placeholder="Введите описание задачи"
            />
          </div>
          <div className="add-severity">
            <div className="severity-buttons">
              {["Не срочно", "Средне", "Срочно"].map((level) => (
                <button
                  key={level}
                  onClick={() => this.handleSeverityChange(level)}
                  className={severity === level ? "active" : ""}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="generate-button-container">
              <button onClick={this.generateTasks}>
                Сгенерировать 1000 задач
              </button>
            </div>
          </div>
        </div>
        <div className="todo-list">
          <div className="filter">
            <input
              type="checkbox"
              checked={showOnlyUncompleted}
              onChange={this.handleFilterChange}
            />
            <span>Скрыть выполненные</span>

            <div className="severity-filter">
              {["Не срочно", "Средне", "Срочно"].map((severity) => (
                <div key={severity}>
                  <input
                    type="checkbox"
                    checked={selectedSeverities.includes(severity)}
                    onChange={() => this.handleSeveritySelect(severity)}
                  />
                  <span>{severity}</span>
                </div>
              ))}
            </div>
          </div>
          {uncompletedTodos.length > 0 && (
            <ul>
              {uncompletedTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onTodoChecked={this.handleTodoChecked(todo.id)}
                  onDelete={this.handleTodoDelete(todo.id)}
                />
              ))}
            </ul>
          )}
          {completedTodos.length > 0 && (
            <div>
              <ul>
                {completedTodos.map((todo) => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    onTodoChecked={this.handleTodoChecked(todo.id)}
                    onDelete={this.handleTodoDelete(todo.id)}
                  />
                ))}
              </ul>
            </div>
          )}
          {uncompletedTodos.length === 0 && completedTodos.length === 0 && (
            <p>По вашим критериям ничего не найдено</p>
          )}
        </div>
      </div>
    );
  }
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showDelete: false };
  }

  render() {
    const { todo, onTodoChecked, onDelete } = this.props;
    return (
      <li
        style={{ color: todo.checked ? "grey" : "black", listStyle: "none" }}
        onMouseEnter={() => this.setState({ showDelete: true })}
        onMouseLeave={() => this.setState({ showDelete: false })}
      >
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={onTodoChecked}
          className={`checkbox ${todo.checked ? "checked" : ""}`}
        />
        <div className="todo-content">
          <b>{todo.name}</b>
          <p>{todo.description}</p>
          <span>{todo.createdAt}</span>
          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
            {todo.severity}
          </span>
        </div>
        {this.state.showDelete && <button onClick={onDelete}>Delete</button>}
      </li>
    );
  }
}

export default App;
