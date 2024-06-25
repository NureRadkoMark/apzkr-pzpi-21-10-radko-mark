package com.example.apz_mobile.views


import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.example.apz_mobile.R
import com.example.apz_mobile.models.User
import com.example.apz_mobile.models.UserDetails
import com.example.apz_mobile.network.ApiServiceInstance
import com.example.apz_mobile.network.UserRepository
import com.example.apz_mobile.viewmodels.UserViewModel
import com.example.apz_mobile.viewmodels.UserViewModelFactory

class ProfileActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private val viewModel: UserViewModel by viewModels {
        UserViewModelFactory(UserRepository(ApiServiceInstance.apiService))
    }

    private lateinit var editTextFirstName: EditText
    private lateinit var editTextSecondName: EditText
    private lateinit var editTextPhoneNumber: EditText
    private lateinit var editTextBirthDay: EditText
    private lateinit var editTextPassportCode: EditText
    private lateinit var buttonEdit: Button
    private lateinit var buttonSave: Button
    private lateinit var buttonCancel: Button
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        sharedPreferences = getSharedPreferences("prefs", Context.MODE_PRIVATE)

        editTextFirstName = findViewById(R.id.editTextFirstName)
        editTextSecondName = findViewById(R.id.editTextSecondName)
        editTextPhoneNumber = findViewById(R.id.editTextPhoneNumber)
        editTextBirthDay = findViewById(R.id.editTextBirthDay)
        editTextPassportCode = findViewById(R.id.editTextPassportCode)
        buttonEdit = findViewById(R.id.buttonEdit)
        buttonSave = findViewById(R.id.buttonSave)
        buttonCancel = findViewById(R.id.buttonCancel)
        progressBar = findViewById(R.id.progressBar)

        buttonEdit.setOnClickListener {
            enableEditing(true)
        }

        buttonSave.setOnClickListener {
            saveUserDetails()
        }

        buttonCancel.setOnClickListener {
            enableEditing(false)
            viewModel.getUserDetails(getToken())
        }

        // Observe the LiveData from ViewModel
        viewModel.userDetailsResponse.observe(this, Observer { user ->
            if (user != null) {
                updateUserDetailsUI(user)
                progressBar.visibility = View.GONE
            }
        })

        viewModel.error.observe(this, Observer { errorMessage ->
            if (errorMessage != null) {
                progressBar.visibility = View.GONE
            }
        })

        // Fetch user details
        progressBar.visibility = View.VISIBLE
        viewModel.getUserDetails(getToken())
    }

    private fun getToken(): String {
        return sharedPreferences.getString("jwtToken", "") ?: ""
    }

    private fun enableEditing(enable: Boolean) {
        editTextFirstName.isEnabled = enable
        editTextSecondName.isEnabled = enable
        editTextPhoneNumber.isEnabled = enable
        editTextBirthDay.isEnabled = enable
        editTextPassportCode.isEnabled = enable
        buttonSave.visibility = if (enable) View.VISIBLE else View.GONE
        buttonCancel.visibility = if (enable) View.VISIBLE else View.GONE
        buttonEdit.visibility = if (!enable) View.VISIBLE else View.GONE
    }

    private fun updateUserDetailsUI(user: User) {
        editTextFirstName.setText(user.firstName)
        editTextSecondName.setText(user.secondName)
        editTextPhoneNumber.setText(user.phoneNumber)
        editTextBirthDay.setText(user.birthDay)
        editTextPassportCode.setText(user.passportCode)
    }

    private fun saveUserDetails() {
        val userDetails = UserDetails(
            FirstName = editTextFirstName.text.toString(),
            SecondName = editTextSecondName.text.toString(),
            PhoneNumber = editTextPhoneNumber.text.toString(),
            BirthDay = editTextBirthDay.text.toString(),
            PassportCode = editTextPassportCode.text.toString(),
            IOTCode = "" // Assuming IOTCode is not edited here
        )

        progressBar.visibility = View.VISIBLE
        viewModel.updateUserDetails(getToken(), userDetails)
        enableEditing(false)
    }
}
