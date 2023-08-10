import axios from "axios";

type User = {
  name: string;
  lastName: string;
  country: string;
};

const form = document.querySelector(".js-form") as HTMLFormElement;
const button = document.querySelector(".js-button") as HTMLButtonElement;
const wrapperElement = document.querySelector(".js-user-wrapper");

const getUsers = () => {
  const users = axios.get("http://localhost:3004/users");

  users.then((res) => {
    wrapperElement.innerHTML = "";
    res.data.forEach((user: User) => {
      const userHTML = `
            <div class="user">
                <div class="user__field">${user.name} ${user.lastName} ${user.country}</div>
            </div>
        `;
      wrapperElement.innerHTML += userHTML;
    });
  });
};


const alertMessage = (message: string): string => {
  return `
    <h3>${message}</h3>
    `;
};

const alert = (message: string, alertSelector: string) => {
  const alert = document.querySelector(".alert") as HTMLDivElement;
  alert.classList.add(alertSelector);
  alert.style.visibility = "visible";
  alert.innerHTML = alertMessage(message);
  setTimeout(() => {
    alert.style.visibility = "hidden";
  }, 3000);
};

const showSuccess = () => {
  alert("Success! You have summoned a new user!", "js-success");
};

const showError = () => {
  alert("Error some Eldrich beast has escaped :(", "js-error");
};

getUsers();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  button.disabled = true;

  const formData = new FormData(form);
  const formDataJson = JSON.stringify(Object.fromEntries(formData.entries()));
  console.log(formDataJson);

  try {
    await axios.post("http://localhost:3004/users", formDataJson, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    showSuccess();
    getUsers();
  } catch (error) {
    showError();
  } finally {
    form.reset();
    button.disabled = false;
  }
});
