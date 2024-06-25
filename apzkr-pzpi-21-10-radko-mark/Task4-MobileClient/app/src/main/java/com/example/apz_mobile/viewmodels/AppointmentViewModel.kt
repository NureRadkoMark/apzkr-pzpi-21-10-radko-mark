package com.example.apz_mobile.viewmodels

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.apz_mobile.models.Appointment
import com.example.apz_mobile.models.Department
import com.example.apz_mobile.models.Pet
import com.example.apz_mobile.network.UserRepository
import kotlinx.coroutines.launch

class AppointmentViewModel(private val repository: UserRepository) : ViewModel() {
    val departments = MutableLiveData<List<Department>>()
    val pets = MutableLiveData<List<Pet>>()
    val error = MutableLiveData<String>()

    fun searchDepartments(address: String, lang: String) {
        viewModelScope.launch {
            try {
                val response = repository.searchDepartments(address, lang)
                if (response.isSuccessful) {
                    departments.postValue(response.body())
                } else {
                    error.postValue("Error fetching departments")
                }
            } catch (e: Exception) {
                error.postValue("Unexpected error: ${e.message}")
            }
        }
    }

    fun fetchPets(token: String) {
        viewModelScope.launch {
            try {
                val response = repository.fetchPets(token)
                if (response.isSuccessful) {
                    pets.postValue(response.body())
                } else {
                    error.postValue("Error fetching pets")
                }
            } catch (e: Exception) {
                error.postValue("Unexpected error: ${e.message}")
            }
        }
    }

    fun makeAppointment(appointment: Appointment) {
        viewModelScope.launch {
            try {
                val response = repository.makeAppointment(appointment)
                if (response.isSuccessful) {
                    // Notify success
                } else {
                    error.postValue("Error making appointment")
                }
            } catch (e: Exception) {
                error.postValue("Unexpected error: ${e.message}")
            }
        }
    }
}
