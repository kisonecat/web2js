program TEST;

type  
  Point	      = record  
		   X,Y,Z : integer ;  
		end;	 
   twochoices = 1..2;
   quarterword = 0..255;
   halfword    = 0..65535;
   twohalves   = packed record rh:halfword;
     case twochoices of 1:(lh:halfword);
                        2:(b0:quarterword;b1:quarterword);
     end;
     
var
   m : array[0..3] of Point;
   p : Point;
   t :  twohalves;

begin
   t.lh := 123;
   t.rh := 555;
   writeln(t.rh);
   m[0].X := 1;
   m[0].Y := 2;
   m[0].Z := 3;
   m[1].X := 1000;
   p.X := 17;
   p.Y := -20;
   p.Z := p.Y * -5;
   writeln();
   writeln(p.Z);
   writeln(p.Y);
   writeln(p.X);
   writeln(m[0].X, ',',m[0].Y, ',', m[0].Z);
   writeln(m[1].X);

end.
