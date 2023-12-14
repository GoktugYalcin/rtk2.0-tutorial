import {createSliceWithThunks} from "../../util/createSliceWithThunk";

const initialState = {
    todos: [
        {
            "userId": 6,
            "id": 101,
            "title": "Kahvaltı yap",
            "completed": true
        },
        {
            "userId": 6,
            "id": 102,
            "title": "Spora git",
            "completed": false
        },
        {
            "userId": 6,
            "id": 103,
            "title": "Kitap oku",
            "completed": false
        }
    ]
}

export const todosSlice = createSliceWithThunks({
    name: 'todos',
    initialState,
    selectors: { //Burası yeni eklenen bir özellik
        getAllTodos: (state) => state,
        getSelectedTodo: (state, userId) => state.find(todo => todo.userId === userId)
    },
    reducers: (create) => ({
        //Normalde kullandığımız gibi bir reducer
        removeTodo: create.reducer((state, action) => {
            state.todos.splice(action.payload, 1)
        }),
        //Benzer şekilde bir reducer daha
        editTodo: create.reducer((state, action) => {
            const found = state.todos.findIndex(i => i.id === action.payload.id)
            state.todos.splice(found, 1, action.payload)
        }),
        //Hazırlanmış bir callback ile yazılmış bir reducer
        addTodo: create.preparedReducer( //Burada iki parametre alan bir fonksiyonumuz var.
            //İlk fonksiyon gelen parametreler ile hazırlık yapmak için bir fonksiyon.
            (text) => {
                return {
                    //İkinci fonksiyon için hazırlanan datayı action'a benzer bir şekilde gönderiyoruz.
                    hazirlik: {
                        id: Math.ceil(Math.random() * 1000),
                        text,
                        completed: false
                    }
                }
            },
            //İkinci fonksiyon ise klasik reducer bazında yazılacak.
            (state, action) => {
                state.todos.push(action.hazirlik) //Görüldüğü gibi istenen şekilde isimlendirilerek çağrılabilir.
            }
        ),
        getTodosFromService: create.asyncThunk(
            //Bildiğimiz asyncThunk tanımını artık slice içerisinde ilk fonksiyonda yapabiliriz.
            async (id = 3, thunk) => {
                const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`)
                return await res.json()
            },
            //İkinci parametre olarak ise bu slice'ta thunk'ın vereceği tepkileri object halinde yazıyoruz.
            {
                pending: () => console.log("Request has been sent!"),
                rejected: () => console.log("An error has been occured during sending request."),
                fulfilled: (state, action) => {
                    console.log(action.payload)
                    action.payload.map(i => state.todos.push(i))
                },
                settled: (state, action) => {
                    //Bu durum ise yeni geldi, fullfiled veya rejected olması halinde her türlü çalışacak bir blok burası.
                    if(action.payload?.length) {
                        alert('thunk ended!')
                        state.isLoading = false
                    }
                }
            }
        )
    })
})

export const { getAllTodos, getSelectedTodo } = todosSlice.selectors
export const { removeTodo, addTodo, getTodosFromService, editTodo} = todosSlice.actions

export default todosSlice.reducer