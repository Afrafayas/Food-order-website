    import { createSlice } from "@reduxjs/toolkit";

    const initial = JSON.parse(localStorage.getItem("cart")) || [];

    const cartSlice = createSlice({
    name: "cart",
    initialState: initial,
    reducers: {
        addToCart: (state, action) => {
            
        const newItem = action.payload;
        const existingItem = state.find((item) => item.id === newItem.id);

        if (existingItem) {
         
            if (existingItem.quantity > 0) {
            existingItem.quantity += 1;
          
            } else {
            alert("No more stock available");
            }
        } else {
            
            state.push({ 
            ...newItem, 
            quantity: 1
            
            });
        }

            localStorage.setItem("cart", JSON.stringify(state));
            },

        decreaseQuantity: (state, action) => {
    const id = action.payload;
    const itemIndex = state.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        if (state[itemIndex].quantity > 1) {
        state[itemIndex].quantity -= 1;
       
        } else {
      
        state.splice(itemIndex, 1);
        }
    }

    localStorage.setItem("cart", JSON.stringify(state));
    },
        removeFromCart: (state, action) => {
        const id = action.payload;
        const updated = state.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
        },

        clearCart: () => {
        localStorage.removeItem("cart");
        return [];
        }
    }
    });

    export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
    export default cartSlice.reducer;
