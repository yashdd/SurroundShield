import express from "express";
import { users } from "../config/mongoCollections.js";

export const createUser = async (name, age, height, weight, bmi, location) => {
    try {
        const userCollection = await users();
        const user = await userCollection.insertOne({ name, age, height, weight, bmi, location });
        return user;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const getUser = async (id) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        return user;
    } catch (e) {
        throw e;
    }
};

export const updateUser = async (id, name, age, height, weight, bmi, location) => {
    try {
        const userCollection = await users();
        const user = await userCollection.updateOne({ _id: id }, { $set: { name, age, height, weight, bmi, location } });
        return user;
    } catch (e) {
        throw e;
    }
};

export const deleteUser = async (id) => {
    try {
        const userCollection = await users();
        const user = await userCollection.deleteOne({ _id: id });
        return user;
    } catch (e) {
        throw e;
    }
};






