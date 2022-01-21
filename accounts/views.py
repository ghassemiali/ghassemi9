from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, User
from django.contrib.auth.decorators import login_required
def login_view(request):
   
   # below variable is for determining whether use session 10-4 or not valid
   # for use session 10-4 you should assign it True and change the login.html form to get the username and password by django form

   session_10_4_flag = False
   if not request.user.is_authenticated:
      if session_10_4_flag:
         if request.method == 'POST':
            form = AuthenticationForm(request=request, data=request.POST)
            if form.is_valid():
               username = form.cleaned_data['username']
               password = form.cleaned_data['password']         
               print(username, password)
               user = authenticate(request, username=username, password=password)
               if user is not None:
                  login(request, user)
                  return redirect('/')

         form = AuthenticationForm()
         content = {'form': form}  
         return render(request, 'accounts/login.html', content)

      else:
         if request.method == 'POST':
            username = request.POST['username']
            password = request.POST['Password']

            try:
               user = User.objects.get(email=username)
               username = user.username
            except:
               pass
            user = authenticate(request, username=username, password=password)
            if user is not None:
               login(request, user)
               return redirect('/')
         return render(request, 'accounts/login.html')
         
   else:
      return redirect('/')

@login_required
def logout_view(request):
   logout(request)
   return redirect('accounts:login')

def signup_view(request):
   if not request.user.is_authenticated:
      if request.method == 'POST':
         form = UserCreationForm(request.POST)
         if form.is_valid():
            user = form.save()
            user.email = request.POST['email']
            user.save()
            return render(request, 'accounts/login.html')
      return render(request, 'accounts/signup.html')
   return render(request, 'website/index.html')

