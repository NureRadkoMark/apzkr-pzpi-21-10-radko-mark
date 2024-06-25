package com.example.apz_mobile.views

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.apz_mobile.R
import com.example.apz_mobile.adapters.DepartmentAdapter
import com.example.apz_mobile.models.Appointment
import com.example.apz_mobile.models.Department
import com.example.apz_mobile.models.Pet
import com.example.apz_mobile.network.ApiServiceInstance
import com.example.apz_mobile.network.UserRepository
import com.example.apz_mobile.viewmodels.AppointmentViewModel
import com.example.apz_mobile.viewmodels.AppointmentViewModelFactory
import com.example.apz_mobile.widgets.DatePickerFragment
import java.text.SimpleDateFormat
import java.util.*

class AppointmentActivity : AppCompatActivity() {

    private val viewModel: AppointmentViewModel by viewModels {
        AppointmentViewModelFactory(UserRepository(ApiServiceInstance.apiService))
    }

    private lateinit var sharedPreferences: SharedPreferences
    private var language: String = "en"
    private lateinit var addressEditText: EditText
    private lateinit var searchButton: Button
    private lateinit var departmentsRecyclerView: RecyclerView
    private lateinit var datePickerButton: Button
    private lateinit var makeAppointmentButton: Button
    private var selectedDepartment: Department? = null
    private var selectedPet: Pet? = null
    private lateinit var petsSpinner: Spinner
    private var appointmentDate: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_appointment)

        sharedPreferences = getSharedPreferences("prefs", Context.MODE_PRIVATE)
        addressEditText = findViewById(R.id.addressEditText)
        searchButton = findViewById(R.id.searchButton)
        departmentsRecyclerView = findViewById(R.id.departmentsRecyclerView)
        datePickerButton = findViewById(R.id.datePickerButton)
        makeAppointmentButton = findViewById(R.id.makeAppointmentButton)
        petsSpinner = findViewById(R.id.petsSpinner)

        departmentsRecyclerView.layoutManager = LinearLayoutManager(this)

        searchButton.setOnClickListener { searchDepartments() }
        datePickerButton.setOnClickListener { showDatePicker() }
        makeAppointmentButton.setOnClickListener { makeAppointment() }

        viewModel.departments.observe(this, Observer { departments ->
            if (departments != null) {
                updateDepartmentsUI(departments)
            }
        })

        viewModel.pets.observe(this, Observer { pets ->
            if (pets != null) {
                updatePetsSpinner(pets)
            }
        })

        viewModel.error.observe(this, Observer { errorMessage ->
            if (errorMessage != null) {
                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
            }
        })

        fetchPets()
    }

    private fun searchDepartments() {
        val address = addressEditText.text.toString()
        viewModel.searchDepartments(address, language)
    }

    private fun fetchPets() {
        val token = sharedPreferences.getString("jwtToken", "") ?: ""
        viewModel.fetchPets(token)
    }

    private fun showDatePicker() {
        val newFragment = DatePickerFragment { year, month, day, hourOfDay, minute ->
            val calendar = Calendar.getInstance().apply {
                set(Calendar.YEAR, year)
                set(Calendar.MONTH, month)
                set(Calendar.DAY_OF_MONTH, day)
                set(Calendar.HOUR_OF_DAY, hourOfDay)
                set(Calendar.MINUTE, minute)
            }
            appointmentDate = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).format(calendar.time)
            datePickerButton.text = appointmentDate
        }
        newFragment.show(supportFragmentManager, "datePicker")
    }

    private fun makeAppointment() {
        val petId = selectedPet?.PetId
        val departmentId = selectedDepartment?.DepartmentId

        if (petId == null || departmentId == null) {
            Toast.makeText(this, "Select department and pet", Toast.LENGTH_SHORT).show()
            return
        }

        val appointment = Appointment(
            DepartmentId = departmentId,
            PetId = petId,
            DateAndTime = appointmentDate,
            Lang = language
        )

        viewModel.makeAppointment(appointment)
    }

    private fun updateDepartmentsUI(departments: List<Department>) {
        val adapter = DepartmentAdapter(this, departments) { department ->
            selectedDepartment = department
        }
        departmentsRecyclerView.adapter = adapter
    }

    private fun updatePetsSpinner(pets: List<Pet>) {
        val petNames = pets.map { it.Name }
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, petNames)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        petsSpinner.adapter = adapter

        petsSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                selectedPet = pets[position]
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                selectedPet = null
            }
        }
    }
}



